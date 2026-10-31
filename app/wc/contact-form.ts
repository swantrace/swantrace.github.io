import { component, html, useEffect, useRef, useState } from "haunted";

type Status = "idle" | "sending" | "sent" | "error";

function ContactForm(this: HTMLElement) {
  const serviceId = this.getAttribute("service-id")?.trim() || "";
  const templateId = this.getAttribute("template-id")?.trim() || "";
  const publicKey = this.getAttribute("public-key")?.trim() || "";
  const configured = Boolean(serviceId && templateId && publicKey);
  const [status, setStatus] = useState<Status>("idle");
  const request = useRef<AbortController>();

  useEffect(() => () => request.current?.abort(), []);

  const open = () => {
    if (status === "sent") setStatus("idle");
    this.querySelector<HTMLButtonElement>("button")?.focus();
    const dialog = this.querySelector<HTMLDialogElement>("dialog");
    dialog?.showModal();
    dialog?.querySelector<HTMLInputElement>("input[name=name]")?.focus();
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    if (request.current || !form.reportValidity()) return;
    const data = new FormData(form);

    if (!configured) {
      const subject = `Portfolio enquiry from ${String(data.get("name")).trim()}`;
      const body = `${String(data.get("message")).trim()}\n\nFrom: ${data.get("name")}\nReply to: ${data.get("email")}`;
      window.location.href = `mailto:frederickhong.5@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 20_000);
    setStatus("sending");
    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: String(data.get("name")).trim(),
              from_email: String(data.get("email")).trim(),
              reply_to: String(data.get("email")).trim(),
              message: String(data.get("message")).trim(),
            },
          }),
          signal: controller.signal,
        }
      );
      if (!response.ok) throw new Error("Submission was not accepted");
      form.reset();
      setStatus("sent");
      this.querySelector<HTMLDialogElement>("dialog")?.close();
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
      request.current = undefined;
    }
  };

  return html`
    <button type="button" class="btn" aria-haspopup="dialog" @click=${open}>
      Let's connect <span aria-hidden="true">↗</span>
    </button>
    <p class="text-base-content/75 max-w-xs text-sm leading-relaxed" role="status" aria-live="polite">
      ${status === "sent" ? "Thanks! Your message has been submitted." : ""}
    </p>
    <dialog class="modal p-4" aria-labelledby="contact-dialog-title" aria-describedby="contact-dialog-description">
      <div class="modal-box w-full max-w-lg">
        <form method="dialog">
          <button type="submit" class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" aria-label="Close contact form">✕</button>
        </form>
        <h2 id="contact-dialog-title" class="pr-8 text-2xl font-bold tracking-tight">Let's connect</h2>
        <p id="contact-dialog-description" class="text-base-content/70 mt-3 text-sm leading-relaxed">
          Have an opportunity or a project in mind? I'd love to hear from you.
        </p>
        <form class="mt-6" @submit=${submit} @input=${() => {
          if (status === "sent" || status === "error") setStatus("idle");
        }}>
          <fieldset class="space-y-4" ?disabled=${status === "sending"}>
            <div>
              <label class="mb-2 block text-sm font-medium" for="contact-name">Name</label>
              <input id="contact-name" class="input w-full" name="name" autocomplete="name" maxlength="100" required autofocus />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium" for="contact-email">Email</label>
              <input id="contact-email" class="input w-full" name="email" type="email" autocomplete="email" maxlength="254" required />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium" for="contact-message">Message</label>
              <textarea id="contact-message" class="textarea min-h-32 w-full" name="message" rows="5" maxlength="5000" required></textarea>
            </div>
            <button class="btn w-full" type="submit">
              ${status === "sending" ? "Sending…" : configured ? "Send message" : "Open email app"}
            </button>
          </fieldset>
          <p class="text-base-content/75 mt-3 text-sm leading-relaxed" role=${status === "error" ? "alert" : "status"} aria-live="polite">
            ${status === "error" ? "Couldn't confirm your submission. Your message is still here; please try again or email me directly." : !configured ? "This opens your email app with the message filled in." : ""}
          </p>
        </form>
        <p class="text-base-content/65 mt-5 text-sm leading-relaxed">
          Or email me directly:
          <a class="link link-hover mt-1 block break-all" href="mailto:frederickhong.5@gmail.com">frederickhong.5@gmail.com</a>
        </p>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button type="submit" aria-label="Close dialog backdrop">Close</button>
      </form>
    </dialog>
  `;
}

customElements.define(
  "contact-form",
  component(ContactForm, {
    useShadowDOM: false,
    observedAttributes: ["service-id", "template-id", "public-key"],
  })
);
