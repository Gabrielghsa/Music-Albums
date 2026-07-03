const formCadastro = document.getElementById("cadastroForm");
formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    try {

        // Verificando se o e-mail já existe
        const resposta = await fetch(
            `http://localhost:3000/usuarios?email=${email}`
        );
        const usuarios = await resposta.json();
        if (usuarios.length > 0) {
            alert("Este e-mail já está cadastrado.");
            return;
        }

        // Criando no db um novo usuário
        const novoUsuario = {
            nome,
            email,
            senha,
            favoritos: []
        };
        const cadastro = await fetch(
            "http://localhost:3000/usuarios",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoUsuario)
            }
        );

        if (!cadastro.ok) {
            throw new Error("Erro ao cadastrar.");
        }
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";

    }
    catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar usuário.");
    }
});