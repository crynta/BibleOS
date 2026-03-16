// initallty planned to load the Bible text from JSON in Rust-side and send it to frontend, implementing search with tantivy (which is overkill for this use case), but now I switched to sqlite (tauri-plugin-sql from typescript).
// ============================================================================

// use serde::{Deserialize, Serialize};
// use std::fs;
// use std::path::PathBuf;
// use tauri::{AppHandle, Manager};

// #[derive(Debug, Serialize, Deserialize, Clone)]
// pub struct Verse {
//     pub verse: String,
//     pub text: String,
// }

// #[derive(Debug, Serialize, Deserialize, Clone)]
// pub struct Chapter {
//     pub chapter: String,
//     pub verses: Vec<Verse>,
// }

// #[derive(Debug, Serialize, Deserialize, Clone)]
// pub struct Book {
//     pub book: String,
//     pub count: u32,
//     pub chapters: Vec<Chapter>,
// }

// #[derive(Debug, Serialize, Clone)]
// pub struct BookInfo {
//     pub name: String,
//     pub chapters: u32,
// }

// fn resources_dir(app: &AppHandle) -> PathBuf {
//     app.path()
//         .resource_dir()
//         .expect("failed to resolve resource dir")
//         .join("resources/books")
// }

// #[tauri::command]
// pub fn get_books(app: AppHandle) -> Result<Vec<BookInfo>, String> {
//     let path = resources_dir(&app).join("Books.json");
//     let data = fs::read_to_string(&path).map_err(|e| format!("Failed to read Books.json: {e}"))?;
//     let names: Vec<String> =
//         serde_json::from_str(&data).map_err(|e| format!("Failed to parse Books.json: {e}"))?;

//     let books = names
//         .into_iter()
//         .map(|name| {
//             let file = resources_dir(&app).join(format!("{name}.json"));
//             let chapters = fs::read_to_string(&file)
//                 .ok()
//                 .and_then(|d| serde_json::from_str::<Book>(&d).ok())
//                 .map(|b| b.count)
//                 .unwrap_or(0);

//             BookInfo { name, chapters }
//         })
//         .collect();

//     Ok(books)
// }

// #[tauri::command]
// pub fn get_chapter(
//     app: AppHandle,
//     book: String,
//     chapter: u32,
// ) -> Result<Vec<Verse>, String> {
//     let path = resources_dir(&app).join(format!("{book}.json"));
//     let data =
//         fs::read_to_string(&path).map_err(|e| format!("Failed to read {book}.json: {e}"))?;
//     let book_data: Book =
//         serde_json::from_str(&data).map_err(|e| format!("Failed to parse {book}.json: {e}"))?;

//     let ch = book_data
//         .chapters
//         .into_iter()
//         .find(|c| c.chapter == chapter.to_string())
//         .ok_or_else(|| format!("Chapter {chapter} not found in {book}"))?;

//     Ok(ch.verses)
// }
