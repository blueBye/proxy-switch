# proxy-switch

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)

An interactive CLI tool to quickly manage and switch system-wide proxy settings on Ubuntu (and other GNOME-based desktops).

## Key Features

* **Interactive Menu**: A simple, fast terminal menu powered by `inquirer` to manage and apply proxies.
* **Profile Management**: Save multiple proxy profiles (host, port, and optional credentials) for different networks (e.g., Work, Home, College).
* **Add, Edit, & Delete**: Easily add new proxies, edit existing ones, or remove those you no longer need.
* **Quick Toggle**: Instantly apply a saved proxy or select "No Proxy" to disable the system proxy.
* **Local Storage**: All proxy configurations are saved securely in a JSON file in your home directory (`~/.proxy-switcher.json`).
* **Single Executable**: Built as a Node.js Single Executable Application (SEA), so it can be run on a target machine without needing Node.js installed.

---

## Requirements

This tool is designed for Linux desktops that use `gsettings` to manage system-wide proxy settings. This primarily includes:
* **GNOME desktops** (The default for Ubuntu, Fedora, etc.)
* The `gsettings` command-line utility must be installed and available in your system's `PATH`.

---

## Installation (from Source)

You can build the single executable from the source code.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/proxy-switch.git](https://github.com/your-username/proxy-switch.git)
    cd proxy-switch
    ```

2.  **Install dependencies:**
    This project uses `pnpm`.
    ```bash
    pnpm install
    ```

3.  **Build the binary:**
    This command runs the full TypeScript compilation, esbuild bundling, and SEA (Single Executable Application) packaging process.
    ```bash
    pnpm package
    ```

4.  **Install the binary:**
    The final executable will be located at `dist/bin/proxy-switch`. For system-wide access, copy it to a directory in your `PATH`.
    ```bash
    sudo cp dist/bin/proxy-switch /usr/local/bin/proxy-switch
    ```

---

## Usage

Once installed, simply run the command in your terminal:

```bash
proxy-switch
````

This will launch an interactive menu.

```
? Select a proxy or action: (Use arrow keys)
❯ Work
  Home
  No Proxy
  Add New Proxy
  Exit
```

**Menu Options:**

* **Select a saved proxy (e.g., `Work`)**: This opens a sub-menu:
    * `Connect`: Applies this proxy to your system settings.
    * `Edit`: Allows you to modify the name, host, port, or credentials.
    * `Delete`: Removes this proxy from your saved list.
* **No Proxy**: Disables the system-wide proxy.
* **Add New Proxy**: Prompts you to enter the details for a new proxy profile.
* **Exit**: Closes the application.

-----

## How It Works

This tool functions as a wrapper around the `gsettings` command. When you apply a proxy, it executes commands to set the following keys:

* `org.gnome.system.proxy mode "manual"` (or `"none"`)
* `org.gnome.system.proxy.http host`
* `org.gnome.system.proxy.http port`
* `org.gnome.system.proxy.https host`
* `org.gnome.system.proxy.https port`
* ...and others, including authentication if provided.

All proxy profiles are saved in `~/.proxy-switcher.json`.

-----

## Development Scripts

The `package.json` includes several scripts for development:

* `pnpm build`: Compiles TypeScript files from `src/` to JavaScript in `dist/`.
* `pnpm bundle`: Uses `esbuild` to bundle the compiled JavaScript into a single file (`dist/bundle.js`).
* `pnpm package`: Runs the full `build` -\> `bundle` -\> `sea-prep` -\> `sea-inject` process to create the final executable binary.

-----

## License

This project is licensed under the Apache-2.0 License.
