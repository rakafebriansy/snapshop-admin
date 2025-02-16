import pino from "pino";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs", "app.log");

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
});

export default logger;
