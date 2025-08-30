import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query = {};
    if (category) {
      query = { category: { $regex: category, $options: 'i' } };
    }
    
    const products = await Product.find(query)
      .populate('relatedProducts', 'name category imageUrl')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('API /api/products GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const name = String(formData.get('name') || '').trim();
    const category = String(formData.get('category') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const tags = String(formData.get('tags') || '').split(',').map(t => t.trim()).filter(Boolean);
    const colors = String(formData.get('colors') || '').split(',').map(c => c.trim()).filter(Boolean);
    const brand = String(formData.get('brand') || '').trim();
    const imageUrlInput = String(formData.get('imageUrl') || '').trim();
    const file = formData.get('imageFile') as File | null;

    if (!name || !category) {
      return NextResponse.json({ error: 'Missing name or category' }, { status: 400 });
    }

    // Resolve imageUrl either from upload or provided URL
    let imageUrl = imageUrlInput;
    if (file && file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const ext = (file.type && file.type.includes('png')) ? 'png' : (file.type && file.type.includes('jpeg')) ? 'jpg' : 'bin';
      const filename = `${Date.now()}-${name.replace(/[^a-z0-9]/gi,'_').toLowerCase()}.${ext}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer as any);
      imageUrl = `/uploads/${filename}`;
    } else if (imageUrl && imageUrl.startsWith('http')) {
      // Download remote image and store locally
      const resp = await fetch(imageUrl);
      if (!resp.ok) {
        return NextResponse.json({ error: `Failed to fetch imageUrl (${resp.status})` }, { status: 400 });
      }
      const contentType = resp.headers.get('content-type') || '';
      const arrayBuffer = await resp.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const guessedExt = contentType.includes('png') ? 'png' : contentType.includes('jpeg') ? 'jpg' : 'jpg';
      const filename = `${Date.now()}-${name.replace(/[^a-z0-9]/gi,'_').toLowerCase()}.${guessedExt}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer as any);
      imageUrl = `/uploads/${filename}`;
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Provide imageFile or imageUrl' }, { status: 400 });
    }

    const product = new Product({
      name,
      category,
      description,
      tags,
      colors,
      brand,
      imageUrl,
    });

    const savedProduct = await product.save();

    // Find and update related products based on category and tags
    await updateRelatedProducts(String(savedProduct._id), category, tags);

    return NextResponse.json({ product: savedProduct }, { status: 201 });
  } catch (error: any) {
    console.error('API /api/products error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');
    
    if (!idParam) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const product = await Product.findByIdAndDelete(idParam);
    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Remove this product from relatedProducts arrays of other products
    await Product.updateMany(
      { relatedProducts: product._id },
      { $pull: { relatedProducts: product._id } }
    );

    // Delete uploaded file if it exists and is under /public/uploads
    try {
      if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.startsWith('/uploads/')) {
        const uploadsPath = path.join(process.cwd(), 'public', product.imageUrl.replace(/^\//, ''));
        await fs.unlink(uploadsPath).catch(() => {});
      }
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API /api/products DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// Helper function to update related products
async function updateRelatedProducts(productId: string, category: string, tags: string[]) {
  try {
    // Find products with similar category or tags
    const relatedQuery = {
      _id: { $ne: productId },
      $or: [
        { category: { $regex: category, $options: 'i' } },
        { tags: { $in: tags.map(t => new RegExp(t, 'i')) } }
      ]
    };

    const relatedProducts = await Product.find(relatedQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id');

    // Update current product's related products
    await Product.findByIdAndUpdate(productId, {
      relatedProducts: relatedProducts.map(p => p._id)
    });

    // Add current product to related products' relatedProducts arrays
    for (const relatedProduct of relatedProducts) {
      await Product.findByIdAndUpdate(relatedProduct._id, {
        $addToSet: { relatedProducts: productId }
      });
    }
  } catch (error) {
    console.error('Error updating related products:', error);
  }
}

