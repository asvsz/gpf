'use client';
import NavbarPaciente from "@/app/components/NavbarPaciente";
import FooterBar from "@/app/components/Footer";
import PrivateRoute from "@/app/components/PrivateRoute";

export default function SistemaDescricao() {
  return (
    <PrivateRoute requiredUserType="patient">
      <div className="gap-4 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <NavbarPaciente />
        <div className="flex row-start-2 items-center sm:items-start z-0">
          <main className="flex-grow p-6 sm:p-12 bg-gray-50">
            <div className="bg-white shadow-lg rounded-lg p-8">
              <h1 className="text-4xl font-bold text-gray-700 mb-6">Sistema de Gestão de Prontuários de Fisioterapia</h1>
              <p className="text-lg text-gray-600 mb-4">
                Nosso sistema foi desenvolvido para fornecer uma plataforma segura, intuitiva e eficiente para o acompanhamento de prontuários de fisioterapia. Com ele, pacientes e profissionais de saúde podem acessar e gerenciar informações de saúde de forma ágil e confiável.
              </p>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Funcionalidades Principais:</h2>
              <ul className="list-disc list-inside mb-6 text-gray-600">
                <li className="mb-2"><strong>Acesso Simplificado:</strong> Usuários podem fazer login e visualizar seus dados de saúde com apenas alguns cliques.</li>
                <li className="mb-2"><strong>Informações Detalhadas:</strong> Inclui seções abrangentes para diagnóstico fisioterapêutico, anamnese, exame físico e muito mais.</li>
                <li className="mb-2"><strong>Segurança Prioritária:</strong> Garantimos a proteção dos dados através de autenticação segura e criptografia.</li>
                <li className="mb-2"><strong>Navegação Intuitiva:</strong> Interface moderna e amigável para que todos, independentemente de habilidades técnicas, possam utilizá-la facilmente.</li>
                <li className="mb-2"><strong>Suporte Multidisciplinar:</strong> Integra diferentes tipos de fichas, como Neurofuncional, Cardiorespiratória e Traumatológica/Ortopédica, facilitando a colaboração entre profissionais de diversas áreas.</li>
              </ul>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quem pode usar?</h2>
              <p className="text-lg text-gray-600">
                Este sistema é projetado tanto para pacientes que desejam acompanhar seu histórico de fisioterapia, quanto para profissionais de saúde que precisam gerenciar e atualizar prontuários de maneira eficiente.
              </p>
              <p className="mt-6 text-lg text-gray-600">
                Explore todas as funcionalidades e veja como nossa plataforma pode transformar a forma de gerenciar informações de saúde, promovendo transparência e acessibilidade para todos.
              </p>
            </div>
          </main>
        </div>
        <FooterBar />
      </div>
    </PrivateRoute>
  )
}
