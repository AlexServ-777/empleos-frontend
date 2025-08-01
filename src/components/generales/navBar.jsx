"use client"
import { useState } from "react";
import React from "react";
import Nav_Movil from "./navBar-items/movil";
import Nav_Pc from "./navBar-items/pc";

export default function NavBar() {
  const [isMenuOpen,setMenuOpen] = useState("");
  return (
    <header className="mt-2">  
      {/*NAV BAR PARA MOVIL */}
      <Nav_Movil isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen}/>
      {/* NAVBAR RESPONSIVO PARA PC */}
      <Nav_Pc/>
    </header>
  );
}