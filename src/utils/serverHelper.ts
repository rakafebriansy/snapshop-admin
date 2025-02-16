import fs from "fs";
import path from "path";

class ServerHelper {
    static async uploadFile(file: any, prefix: string): Promise<string> {
        const ext = path.extname(file.originalFilename);
        const fileName = `${prefix}-${Date.now()}${ext}`;
        const filePath = path.join(process.cwd(), "public/uploads", fileName);

        const data = fs.readFileSync(file.filepath);
        fs.writeFileSync(filePath, data);
        fs.unlinkSync(file.filepath);

        return `/uploads/${fileName}`;
    }

    static async deleteFile(imageUrl: string): Promise<void> {
        const filePath = path.join(process.cwd(), "public", imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

}

export default ServerHelper;