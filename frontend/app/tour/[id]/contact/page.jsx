"use client"
import { useRouter, useParams } from "next/navigation";

const Contact = () => {
    const { id } = useParams();
    console.log(id);
    
    return (
      <div>
        <h1>Contact id{id}</h1>
      </div>
    );
  };
  
  export default Contact;
  