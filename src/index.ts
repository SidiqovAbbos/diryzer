#!/usr/bin/env node

import { Chalk } from "chalk";
import { Command } from "commander";
import { DirectoryAnalyzer, FileType } from "./directory-analyzer.js";
import { fileColors, defaultColor } from "./file-colors.js";

const chalk = new Chalk();

interface CommandOptions {
  exclude?: string[];
  depth: string;
}

interface ColoredFileType extends FileType {
  color: string;
}

function displayProgressBar(statisticValues: ColoredFileType[]): void {
  const progressBar = statisticValues
    .map(file => {
      const barLength = Math.round((file.percentage / 100) * 50);
      return barLength > 0 ? chalk.bgHex(file.color)(" ".repeat(barLength)) : "";
    })
    .filter(Boolean);

  const dividerLength = 50 + progressBar.length / 2;
  console.log("-".repeat(dividerLength));
  console.log(progressBar.join("|"));
  console.log("-".repeat(dividerLength));
}

function displayStatistics(statisticValues: ColoredFileType[]): void {
  console.log(chalk.bold("File Type Statistics:"));
  statisticValues.forEach(({ extension, count, percentage, color }) => {
    const extensionStr = chalk.bgHex(color)(extension.padEnd(10));
    const percentageStr = `(${percentage.toFixed(2) + "%"})`;
    const countStr = count.toString().padEnd(3);

    console.log(`${extensionStr} :${chalk.cyan(countStr)} ${percentageStr}`);
  });
}

function analyzeDirectory(directory: string, options: CommandOptions): ColoredFileType[] {
  const analyzer = new DirectoryAnalyzer({
    directoryPath: directory,
    depth: parseInt(options.depth),
    excludePatterns: options.exclude || [],
  });

  if (!analyzer.isDirectoryValid()) {
    throw new Error(`The directory "${directory}" does not exist.`);
  }

  const statistics = analyzer.analyze();
  console.log('-'.repeat(30));
  console.log(`| Total Files: ${chalk.cyan(analyzer.getFilesCount())}`.padEnd(39) + '|');
  console.log(`| Total File Types: ${chalk.cyan(Object.keys(statistics).length)}`.padEnd(39) + '|');
  console.log('-'.repeat(30));
  return Object.values(statistics)
    .sort((a, b) => b.count - a.count)
    .map(file => ({
      ...file,
      color: fileColors[file.extension] || defaultColor,
    }));
}

function handleCommandAction(directory: string, options: CommandOptions): void {
  try {
    const statisticValues = analyzeDirectory(directory, options);
    displayStatistics(statisticValues);
    displayProgressBar(statisticValues);
  } catch (error) {
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

// Command configuration
const program = new Command();
program
  .name("diryzer")
  .description("A CLI tool to analyze the distribution of file types in a directory")
  .version("1.1.5")
  .argument("<directory>", "Directory to analyze")
  .option("-e, --exclude <patterns...>", "Patterns to exclude from analysis")
  .option("-d, --depth <number>", "Depth of subdirectories to analyze", "5")
  .action(handleCommandAction);

program.parse(process.argv);
