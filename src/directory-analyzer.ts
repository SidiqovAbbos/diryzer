import fs from "fs";
import path from "path";
import { globSync } from "glob";

/**
 * Represents a file type with its extension, count, and percentage.
 */
export interface FileType {
  extension: string;
  count: number;
  percentage: number;
}

/**
 * Configuration options for the DirectoryAnalyzer.
 */
export type DirectoryAnalyzerConfig = {
  directoryPath: string;
  depth: number;
  excludePatterns: string[];
};

/**
 * Analyzes the distribution of file types in a directory.
 */
export class DirectoryAnalyzer {
  private readonly dirPath: string;
  private readonly files: string[] = [];

  /**
   * Creates an instance of DirectoryAnalyzer.
   * @param config - Configuration options for the analyzer.
   */
  constructor({
    directoryPath = ".",
    depth = 5,
    excludePatterns = [],
  }: Partial<DirectoryAnalyzerConfig> = {}) {
    this.dirPath = directoryPath;
    this.files = globSync(`${directoryPath}/**/*`, {
      nodir: true,
      ignore: excludePatterns,
      maxDepth: depth || undefined,
    });
  }

  /**
   * Checks if the directory is valid.
   * @returns True if the directory exists and is a directory, false otherwise.
   */
  isDirectoryValid(): boolean {
    return (
      fs.existsSync(this.dirPath) && fs.lstatSync(this.dirPath).isDirectory()
    );
  }

  /**
   * Gets the total number of files in the directory.
   * @returns The total number of files.
   */
  getFilesCount(): number {
    return this.files.length;
  }

  /**
   * Analyzes the file types in the directory.
   * @returns An object where the keys are file extensions and the values are FileType objects.
   */
  public analyze(): Record<string, FileType> {
    const fileStats: Record<string, number> = {};
    const totalFiles = this.getFilesCount();

    this.files.forEach((file) => {
      const ext = path.extname(file);
      fileStats[ext] = (fileStats[ext] || 0) + 1;
    });

    const fileTypes: Record<string, FileType> = {};
    for (const ext in fileStats) {
      fileTypes[ext] = {
        extension: ext || "unknown",
        count: fileStats[ext],
        percentage: (fileStats[ext] / totalFiles) * 100,
      };
    }

    return fileTypes;
  }
}
