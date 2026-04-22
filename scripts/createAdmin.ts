// C:\Users\DELL\Desktop\Portfolio\client\scripts\createAdmin.ts

import { connectToDatabase } from '../lib/mongodb.js';
import bcrypt from 'bcryptjs';
import { Db, ObjectId } from 'mongodb'; // Import Db and ObjectId types

// Define the interface for your User document
interface UserDocument {
  _id?: ObjectId; // MongoDB adds this automatically
  name: string;
  email: string;
  password: string; // Hashed password
  role: 'admin' | 'user'; // Or a more specific type if you have more roles
  createdAt: Date;
  updatedAt: Date;
}

async function createAdmin(): Promise<void> {
  try {
    console.log('Attempting to connect to the database...');
    const { db }: { db: Db } = await connectToDatabase();
    console.log('Database connection successful.');

    // Get the users collection, explicitly typing it with UserDocument
    const usersCollection = db.collection<UserDocument>('users');

    // Check if any admin users already exist
    // TypeScript will now correctly infer existingAdmin as UserDocument | null
    const existingAdmin = await usersCollection.findOne({
      role: 'admin'
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists:', existingAdmin.email);
      process.exit(0);
      return; // Added return to explicitly stop execution
    }

    const name: string = 'Jesutofunmi';
    const email: string = 'tofunmi73@gmail.com';
    const password_plain: string = 'peculiarwizard';

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password_plain, 10);

    // Create admin user object, ensuring it conforms to UserDocument
    const adminUser: UserDocument = {
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(adminUser);

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password_plain); // Display plain password for user reference
    console.log('🆔 User ID:', result.insertedId);

    process.exit(0); // Exit successfully

  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message || error);
    process.exit(1); // Exit with an error code
  }
}

// Run the function
createAdmin();