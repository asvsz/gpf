import React from 'react';

const FooterBar: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-20 bg-custom-green text-white text-center py-4">
      <div className="container mx-auto ">
        <p className="font-medium">&copy; 2024 GPF <br/>Todos os direitos reservados</p>
      </div>
    </footer>
  );
};

export default FooterBar;
