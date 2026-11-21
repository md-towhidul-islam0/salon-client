'use client'
import React from 'react';
interface PaybuttonProps {
  appointmentId: string;
}

const Paybutton = ({ appointmentId }: PaybuttonProps) => {
    const handlepay = () => {
        console.log("Pay")
    }
    return (
        <div>
            {/* <button
                type="button"
                onClick={() => handlepay()}
                title="Payment will be implemented later"
                
            >
             
            </button> */}
            <form action={`/api/checkout_sessions?serviceID=${appointmentId}`} method="POST">
                <section>
                    <button type="submit" role="link" className="inline-flex h-9 cursor-pointer  items-center justify-center rounded-lg border border-accent/25 bg-accent/5 px-2 text-xs font-medium ">
                         Pay now
                    </button>
                </section>
            </form>
        </div>
    );
};

export default Paybutton;