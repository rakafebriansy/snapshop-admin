import pino from "pino";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs", "app.log");

const formatter = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const logger = pino({
    transport: {
        targets: [
            {
                target: "pino/file",
                options: { destination: logFilePath }, // Simpan ke file
            },
            {
                target: "pino-pretty", // Untuk tampilan lebih rapi di terminal
                options: { colorize: true },
            },
        ],
    },
    timestamp: () => `,"time":"${formatter.format(new Date())}"`,
});

export default logger;
