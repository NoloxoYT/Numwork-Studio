// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::PathBuf};

#[derive(serde::Serialize)]
struct FileEntry {
    path: String,
    name: String,
    is_dir: bool,
}

#[tauri::command]
async fn get_home_dir() -> Result<String, String> {
    dirs::home_dir()
        .map(|path| path.to_string_lossy().into_owned())
        .ok_or_else(|| "Could not determine home directory".into())
}

#[tauri::command]
async fn read_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let path_buf = PathBuf::from(path);
    if !path_buf.exists() {
        return Err(format!("Path does not exist: {}", path_buf.display()));
    }
    if !path_buf.is_dir() {
        return Err(format!("Path is not a directory: {}", path_buf.display()));
    }

    let mut entries = Vec::new();
    for entry in fs::read_dir(&path_buf).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        let name = path.file_name().map_or_else(|| "".into(), |s| s.to_string_lossy().into_owned());
        let is_dir = path.is_dir();
        entries.push(FileEntry {
            path: path.to_string_lossy().into_owned(),
            name,
            is_dir,
        });
    }
    Ok(entries)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_home_dir, read_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
