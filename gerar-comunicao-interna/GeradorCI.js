const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");

const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(
    path.resolve(__dirname, "template_ci.docx"),
    "binary"
);

const zip = new PizZip(content);


const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
});

const caminhoContador = path.join(__dirname, "contador.json")

function getNovoNumeroCI() {
  const dados = JSON.parse(fs.readFileSync(caminhoContador, "utf-8"));
  const novoNumero = dados.numeroParecer + 1;
  fs.writeFileSync(caminhoContador, JSON.stringify({ numeroParecer: novoNumero }, null, 2));
  return String(novoNumero).padStart(4, "0");
}

const novoNumeroCI = getNovoNumeroCI();

const dataAtual = new Date();
const dataFormatada = dataAtual.toLocaleDateString("pt-BR")


try{
    doc.render({
    numero_comunicacao_interna: novoNumeroCI,
    data_criacao_ci:dataFormatada,
    nome: "Maria",
    termo_cooperacao: "TCT n° numero/2024/XXXX/ZZZZ \n Modalidade: Iniciação Científica" ,
    valor_da_bolsa: "0,00",
    periodo_vigencia : "01/01/01 a 02/02/02"
});

} catch (error){
    console.error(error)
}


const buf = doc.getZip().generate({
    type: "nodebuffer",
    
    compression: "DEFLATE",
});

fs.writeFileSync(path.resolve(__dirname, "comunicacao-interna.docx"), buf);
