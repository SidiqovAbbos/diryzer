#!/usr/bin/env node

import { Chalk } from "chalk";
import { Command } from "commander";
import { DirectoryAnalyzer, FileType } from "./directory-analyzer.js";
import { fileColors, defaultColor } from "./utils/file-colors.js";
const program = new Command();
const chalk = new Chalk();

type ColoredFileType = FileType & { color: string };
type CommandOptions = {
  exclude?: string[];
  depth: string;
  percentage: boolean;
};

function handleCommandAction(directory: string, options: CommandOptions) {
  try {
    const analyzer = new DirectoryAnalyzer({
      directoryPath: directory,
      depth: parseInt(options.depth),
      excludePatterns: options.exclude || [],
    });
    if (!analyzer.isDirectoryValid()) {
      console.log(chalk.red(`The directory "${directory}" does not exist.`));
      process.exit(1);
    }

    const statistics = analyzer.analyze();

    console.log(`Total Files: ${analyzer.getFilesCount()}`);
    console.log(`Total File Types: ${Object.keys(statistics).length}\n`);

    const statisticValues: ColoredFileType[] = Object.values(statistics)
      .sort((a, b) => b.count - a.count)
      .map((file) => ({
        ...file,
        color: fileColors[file.extension] || defaultColor,
      }));

    let progressBar = "";
    statisticValues.forEach((file) => {
      const progressBarLength = Math.round((file.percentage / 100) * 20);
      progressBar += chalk.hex(file.color)("=".repeat(progressBarLength));
    });
    console.log(`[${progressBar.padEnd(20)}]`);

    for (const file of statisticValues) {
      const extensionStr = chalk.hex(file.color)(file.extension.padEnd(10));
      const percentageStr = options.percentage
        ? `(${chalk.cyan(file.percentage.toFixed(2) + "%")})`
        : "";
      const countStr = file.count.toString().padEnd(3);

      console.log(`${extensionStr}:${countStr} ${percentageStr}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    } else {
      console.error(chalk.red(String(error)));
    }
  }
}

program
  .name("diryzer")
  .description(
    "A CLI tool to analyze the distribution of file types in a directory"
  )
  .version("1.1.4")
  .argument("<directory>", "Directory to analyze")
  .option("-e, --exclude <patterns...>", "Patterns to exclude from analysis")
  .option("-d, --depth <number>", "Depth of subdirectories to analyze", "5")
  .option("-p, --percentage", "Show file distribution as percentages", false)
  .action(handleCommandAction);

program.parse(process.argv);
