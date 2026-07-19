---
title: "Complete Guide to HTML Form Controls"
date: "2025-01-15"
tags: ["html", "forms", "web-development", "validation"]
topic: ["frontend", 2]
excerpt:
  "A comprehensive guide to all HTML form input types with interactive
  demos, validation examples, and modern web APIs."
---

# Complete Guide to HTML Form Controls

HTML forms are the backbone of user interaction on the web. This
comprehensive guide covers every form control type with interactive
demos and validation examples.

```html demo
<div class="mx-auto max-w-4xl p-6">
  <form
    id="all-inputs-form"
    action="#"
    method="post"
    enctype="multipart/form-data"
    onsubmit="event.preventDefault();"
    class="space-y-8"
  >
    <!-- Hidden metadata -->
    <input type="hidden" name="formId" value="all-inputs-demo" />
    <input type="hidden" name="version" value="1.0.0" />

    <!-- Personal Information Card -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-6 text-2xl">Personal Information</h2>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="form-control">
            <label class="label">
              <span class="label-text">First name</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autocomplete="given-name"
              required
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Last name</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autocomplete="family-name"
              required
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Username</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              minlength="3"
              maxlength="20"
              pattern="[a-zA-Z0-9_]+"
              autocomplete="username"
              required
              title="Alphanumeric characters and underscores only"
              class="input input-bordered"
            />
            <label class="label">
              <span class="label-text-alt">
                3-20 characters, alphanumeric and underscores only
              </span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minlength="8"
              autocomplete="new-password"
              required
              class="input input-bordered"
            />
            <label class="label">
              <span class="label-text-alt">Minimum 8 characters</span>
            </label>
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Bio</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            maxlength="500"
            placeholder="Tell us a bit about yourself"
            class="textarea textarea-bordered"
          ></textarea>
          <label class="label">
            <span class="label-text-alt">Maximum 500 characters</span>
          </label>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              multiple
              class="input input-bordered"
            />
            <label class="label">
              <span class="label-text-alt">
                Multiple emails separated by commas
              </span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Phone</span>
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              autocomplete="tel"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Website</span>
            </label>
            <input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Site search</span>
            </label>
            <input
              id="search"
              name="search"
              type="search"
              placeholder="Search something"
              class="input input-bordered"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Address Card -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-6 text-2xl">Address</h2>

        <div class="form-control">
          <div class="grid grid-cols-[200px_1fr] items-center gap-4">
            <label for="street" class="label justify-start p-0">
              <span class="label-text">Street address</span>
            </label>
            <input
              id="street"
              name="street"
              type="text"
              autocomplete="address-line1"
              class="input input-bordered"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="city" class="label justify-start p-0">
                <span class="label-text">City</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autocomplete="address-level2"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="state" class="label justify-start p-0">
                <span class="label-text">State/Province</span>
              </label>
              <input
                id="state"
                name="state"
                type="text"
                autocomplete="address-level1"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="zip" class="label justify-start p-0">
                <span class="label-text">ZIP/Postal code</span>
              </label>
              <input
                id="zip"
                name="zip"
                type="text"
                autocomplete="postal-code"
                class="input input-bordered"
              />
            </div>
          </div>
        </div>

        <div class="form-control">
          <div class="grid grid-cols-[200px_1fr] items-center gap-4">
            <label for="country" class="label justify-start p-0">
              <span class="label-text">Country</span>
            </label>
            <select
              id="country"
              name="country"
              autocomplete="country"
              class="select select-bordered"
            >
              <option value="">-- Select --</option>
              <optgroup label="Americas">
                <option>United States</option>
                <option>Canada</option>
              </optgroup>
              <optgroup label="EMEA">
                <option>United Kingdom</option>
                <option>Germany</option>
              </optgroup>
              <optgroup label="APAC">
                <option>Japan</option>
                <option>Australia</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Preferences Card -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-6 text-2xl">Preferences</h2>

        <div class="form-control">
          <div class="grid grid-cols-[200px_1fr] items-center gap-4">
            <label for="favoriteLang" class="label justify-start p-0">
              <span class="label-text">
                Favorite language (autocomplete)
              </span>
            </label>
            <input
              id="favoriteLang"
              name="favoriteLang"
              list="lang-list"
              placeholder="Start typing…"
              class="input input-bordered"
            />
          </div>
          <datalist id="lang-list">
            <option value="HTML"></option>
            <option value="CSS"></option>
            <option value="JavaScript"></option>
            <option value="TypeScript"></option>
            <option value="Python"></option>
            <option value="Go"></option>
            <option value="Rust"></option>
          </datalist>
        </div>

        <div class="form-control">
          <div class="grid grid-cols-[200px_1fr] items-start gap-4">
            <label class="label justify-start p-0">
              <span class="label-text">Theme</span>
            </label>
            <div class="flex flex-col gap-2">
              <label class="label cursor-pointer justify-start">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked
                  class="radio radio-primary"
                />
                <span class="label-text ml-2">Light</span>
              </label>
              <label class="label cursor-pointer justify-start">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  class="radio radio-primary"
                />
                <span class="label-text ml-2">Dark</span>
              </label>
              <label class="label cursor-pointer justify-start">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  class="radio radio-primary"
                />
                <span class="label-text ml-2">System</span>
              </label>
            </div>
          </div>
        </div>

        <div class="form-control">
          <div class="grid grid-cols-[200px_1fr] items-start gap-4">
            <label class="label justify-start p-0">
              <span class="label-text">Notifications</span>
            </label>
            <div class="flex flex-col gap-2">
              <label class="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  name="newsletter"
                  value="yes"
                  checked
                  class="checkbox checkbox-primary"
                />
                <span class="label-text ml-2">
                  Subscribe to newsletter
                </span>
              </label>
              <label class="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  name="smsAlerts"
                  value="yes"
                  class="checkbox checkbox-primary"
                />
                <span class="label-text ml-2">Enable SMS alerts</span>
              </label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="color" class="label justify-start p-0">
                <span class="label-text">Accent color</span>
              </label>
              <input
                id="color"
                name="accentColor"
                type="color"
                value="#0ea5e9"
                class="h-12 w-16 rounded border"
              />
            </div>
          </div>

          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="number" class="label justify-start p-0">
                <span class="label-text">Items per page</span>
              </label>
              <input
                id="number"
                name="pageSize"
                type="number"
                min="5"
                max="100"
                step="5"
                value="20"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="range" class="label justify-start p-0">
                <span class="label-text">Text size</span>
              </label>
              <input
                id="range"
                name="textScale"
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value="1"
                class="range range-primary"
              />
            </div>
          </div>

          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="month" class="label justify-start p-0">
                <span class="label-text">Billing month</span>
              </label>
              <input
                id="month"
                name="billingMonth"
                type="month"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="week" class="label justify-start p-0">
                <span class="label-text">Sprint week</span>
              </label>
              <input
                id="week"
                name="sprintWeek"
                type="week"
                class="input input-bordered"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dates & Times Card -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-6 text-2xl">Dates & Times</h2>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="date" class="label justify-start p-0">
                <span class="label-text">Birth date</span>
              </label>
              <input
                id="date"
                name="birthDate"
                type="date"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="time" class="label justify-start p-0">
                <span class="label-text">Contact time</span>
              </label>
              <input
                id="time"
                name="contactTime"
                type="time"
                class="input input-bordered"
              />
            </div>
          </div>

          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="datetime" class="label justify-start p-0">
                <span class="label-text">Appointment</span>
              </label>
              <input
                id="datetime"
                name="appointment"
                type="datetime-local"
                step="60"
                class="input input-bordered"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Files & Media Card -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-6 text-2xl">Files & Media</h2>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label for="avatar" class="label justify-start p-0">
                <span class="label-text">Avatar</span>
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                class="file-input file-input-bordered"
              />
            </div>
          </div>

          <div class="form-control">
            <div
              class="grid grid-cols-[120px_1fr] items-center gap-4"
            >
              <label
                for="attachments"
                class="label justify-start p-0"
              >
                <span class="label-text">Attachments</span>
              </label>
              <input
                id="attachments"
                name="attachments"
                type="file"
                multiple
                class="file-input file-input-bordered"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Card -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-6 text-2xl">Form Actions</h2>

        <div class="card-actions justify-end gap-2">
          <button
            type="button"
            name="noopButton"
            value="clicked"
            class="btn btn-outline"
          >
            Plain Button
          </button>

          <input
            type="reset"
            value="Reset form"
            class="btn btn-ghost"
          />

          <button
            type="button"
            onclick="
              const form = this.closest('form');
              const formData = new FormData(form);
              const data = Object.fromEntries(formData);
              document.getElementById('form-data-json').textContent = JSON.stringify(data, null, 2);
              document.getElementById('form-data-preview').showPopover();
            "
            class="btn btn-primary"
          >
            Preview Form Data
          </button>
        </div>
      </div>
    </div>

    <!-- Form data preview -->
    <div
      id="form-data-preview"
      popover
      class="card bg-base-100 max-w-2xl p-6 shadow-xl"
    >
      <div class="card-body">
        <h3 class="card-title mb-4">Form Data JSON</h3>
        <pre
          id="form-data-json"
          class="bg-base-200 max-h-80 overflow-auto rounded p-4 text-sm whitespace-pre-wrap"
        ></pre>
        <div class="card-actions mt-4 justify-end">
          <button
            onclick="this.closest('[popover]').hidePopover()"
            class="btn btn-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
```
