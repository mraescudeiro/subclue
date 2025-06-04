// subclue-web/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL?.split('@')[1],
  api_key: process.env.CLOUDINARY_URL?.split('//')[1]?.split(':')[0],
  api_secret: process.env.CLOUDINARY_URL?.split(':')[2]?.split('@')[0],
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  // Lê o arquivo como Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const uploadResult = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error || !result) throw error;
      return result;
    });

    // Adaptação para funcionar no Next.js Edge/Node.js 18+
    // Utilize upload_stream com promise
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'produtos' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Retorna a URL segura da imagem no Cloudinary
    // @ts-ignore
    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
