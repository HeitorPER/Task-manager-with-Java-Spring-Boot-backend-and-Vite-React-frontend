# Auto Formatação com ESLint ao Salvar

## 🔧 Configuração no VS Code

Para ativar a auto formatação do ESLint sempre que você salvar um arquivo, siga estes passos:

### Opção 1: Configuração no Workspace (Recomendado)

1. Abra o arquivo `.vscode/settings.json` (ou crie se não existir)
2. Adicione as seguintes configurações:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": false,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### Opção 2: Configuração Global

1. Abra as configurações do VS Code (`Ctrl+,` ou `Cmd+,`)
2. Procure por "Code Actions On Save"
3. Clique em "Edit in settings.json"
4. Adicione a mesma configuração acima

## 📦 Extensão Necessária

Certifique-se de ter a extensão do ESLint instalada:

**ESLint** - `dbaeumer.vscode-eslint`

Para instalar:
1. Abra o painel de extensões (`Ctrl+Shift+X`)
2. Procure por "ESLint"
3. Clique em "Install"

## ✅ Como Testar

1. Abra um arquivo `.tsx` ou `.ts`
2. Adicione um código com problemas de formatação:
```tsx
const test="test";    // aspas duplas, ponto e vírgula
```
3. Salve o arquivo (`Ctrl+S`)
4. O código deve ser automaticamente formatado para:
```tsx
const test = 'test'
```