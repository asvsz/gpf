import React from 'react';

const FooterBar: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-20 bg-green-800 text-white text-center py-4">
      <div className="container mx-auto ">
        <p className="text-sm ">&copy; 2024 Meu Site. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default FooterBar;
