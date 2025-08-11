"use server"

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
    const snapshot = await getDocs(collection(db, 'Products'));
    const products = snapshot.docs.map(doc => ({ 
        id: doc.id, ...doc.data() 
    }));
    

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data } = await resend.emails.send({
            from: "cawine@cawineapp.com",
            to: "cawinetechnologies@gmail.com",
            subject: "New order from Cawine",
            html: "<strong>You have new order from client thank you!</strong>"
        });

        return NextResponse.redirect("https://www.cawineapp.com/orderstatus.html");
        // return NextResponse.json({ message: "Message sent successfully!", data });

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ message: "Failed to send email", error: error });
    }

}