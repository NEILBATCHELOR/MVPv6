import React from "react";

const Header = () => {
  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Unlock Institutional Liquidity</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Welcome, Neil</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
