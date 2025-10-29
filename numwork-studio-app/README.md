# Numwork Studio App

This is a Tauri-based code editor application designed for developing C++ applications for Numwork calculators. It features a Monaco Editor (the same engine as VS Code) for code editing and a file explorer for project navigation.

## Features

*   **Code Editor:** Integrated Monaco Editor with C++ syntax highlighting.
*   **File Explorer:** Navigate through your local file system to open and manage project files.
*   **Refactoring Tools (Planned):** Intelligent minification of variables, removal of comments, and empty lines.
*   **Numwork App Testing (Planned):** Automated deployment of user applications to `/rpn-app/src` and execution of platform-specific setup scripts.
*   **Cross-platform Builds:** Automated CI/CD workflow for macOS, Linux, and Windows.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js (v20 or higher):** Required for frontend development and Tauri CLI.
    ```bash
    # Example for Ubuntu
    sudo apt update
    sudo apt install nodejs npm
    ```
*   **Rust (stable toolchain):** Required for the Tauri backend.
    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```
*   **Tauri Prerequisites for your OS:**
    *   **Linux (Ubuntu/Debian):**
        ```bash
        sudo apt update
        sudo apt install -y libwebkit2gtk-4.1-dev librsvg2-dev
        ```
    *   **Windows (for building installers from Linux/macOS):**
        ```bash
        # Install the GNU toolchain for cross-compilation
        rustup target add x86_64-pc-windows-gnu
        # Install MinGW-w64
        sudo apt install -y mingw-w64
        # Install NSIS for installer creation
        sudo apt install -y nsis
        ```
        *(Note: For native Windows development, you would typically install Visual Studio Build Tools with C++ development workload.)*

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/NoloxoYT/Numwork-Studio.git
    cd Numwork-Studio/numwork-studio-app
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Install Monaco Editor React wrapper:**
    ```bash
    npm install @monaco-editor/react
    ```

## Running the Application

### Development Mode (Local Machine)

To run the application in development mode on your local machine (requires a graphical environment):

```bash
cd numwork-studio-app
npm run tauri dev
```

### Building for Production

To build the application for a specific platform:

*   **Windows (.exe installer):**
    ```bash
    cd numwork-studio-app
    npm run tauri build -- --target x86_64-pc-windows-gnu
    ```
    The installer will be found in `src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis/`.

*   **Linux (AppImage/Debian package):**
    ```bash
    cd numwork-studio-app
    npm run tauri build -- --target x86_64-unknown-linux-gnu # or x86_64-unknown-linux-musl
    ```

*   **macOS (.app bundle):**
    ```bash
    cd numwork-studio-app
    npm run tauri build -- --target aarch64-apple-darwin # or x86_64-apple-darwin
    ```

## CI/CD with GitHub Actions

A GitHub Actions workflow is configured in `.github/workflows/build.yaml` to automatically build the application for macOS, Ubuntu, and Windows on `push` and `pull_request` events to the `main` branch.

## Future Development (Planned Features)

*   **Refactoring Tools:**
    *   Remove comments from C++ code.
    *   Remove empty lines from C++ code.
    *   Intelligent minification of variable names (integral, modifying all occurrences within scope).
*   **Numwork App Testing Integration:**
    *   Copy user's application files to `/rpn-app/src` (within the `numwork-studio-app` directory).
    *   Execute the appropriate setup script (`/rpn-app/setup.ps1` for Windows or `/rpn-app/setup.sh` for Linux) located in `/numwork-studio-app/rpn-app/`.
