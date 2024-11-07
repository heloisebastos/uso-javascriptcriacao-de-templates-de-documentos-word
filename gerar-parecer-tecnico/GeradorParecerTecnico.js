const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");

const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(
    path.resolve(__dirname, "templateParecerTecnico.docx"),
    "binary"
);

const zip = new PizZip(content);


const Novodocumento = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
});

const dataAtual = new Date();
const dataFormatada = dataAtual.toLocaleDateString("pt-BR")

const anoAtual = new Date().getFullYear()

const caminhoContador = path.join(__dirname, "contador.json")

function getNovoNumeroParecer() {
  const dados = JSON.parse(fs.readFileSync(caminhoContador, "utf-8"));
  const novoNumero = dados.numeroParecer + 1;
  fs.writeFileSync(caminhoContador, JSON.stringify({ numeroParecer: novoNumero }, null, 2));
  return String(novoNumero).padStart(4, "0");
}

function formatDate() {
    const data = new Date();
    const dia = data.getDate();
    const mes = data.toLocaleString('pt-BR', { month: 'long' });
    const ano = data.getFullYear();
    
    return `${dia} de ${mes} de ${ano}`;
}

const novaDataEstabelecimentoTemo = formatDate();
  const numeroParecer = getNovoNumeroParecer();


try{
    Novodocumento.render({
    nome:"Maria da Silva",
    data_criacao_termo : dataFormatada,
    ano: anoAtual,
    numero_parecer : numeroParecer,
    instituicao : "ifmt",
    numero_termo : "0123/2024",
    cargo_remetente : "Diretora",
    nome_remetente: "Sra. Joana de Oliveira",
    numero_oficio : "72/2024",
    setor_instituicao : "RTR-DPPP/RTR-PPPP/RTR/IFMT",
    titulo_projeto:"Uma proposta de pesquisa sobre gerar parecer tecnico usando JavaScript+Node",
    nome_professor:"Oliveira do Brasil",
    data_estabelecimento_termo : novaDataEstabelecimentoTemo, 
    tipo_de_bolsa : "Iniciação Científica",
    valor_da_bolsa : "R$ 00,00",
    pessoa : "o aluno",
    período_duracao_projeto : "01/11/2024 a 31/10/2024"
   

});

} catch (error){
    console.error(error)
}



const buf = Novodocumento.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
});

fs.writeFileSync(path.resolve(__dirname, "parecer-tecnico.docx"), buf);



