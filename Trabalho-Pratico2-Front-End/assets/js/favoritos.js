const container = document.getElementById("favoritos-container");

async function mostrarFavoritos() {

    const usuarioAtual = JSON.parse(
        sessionStorage.getItem("usuarioLogado")
    );

    if (!usuarioAtual) {

        window.location.href = "login.html";
        return;

    }

    // Busca todos os álbuns
    const resposta = await fetch("http://localhost:3000/albums");
    const albums = await resposta.json();

    // Filtra apenas os favoritos do usuário
    const favoritos = albums.filter(album =>
        usuarioAtual.favoritos &&
        usuarioAtual.favoritos.includes(album.id)
    );

    container.innerHTML = "";

    if (favoritos.length === 0) {

        container.innerHTML = `
            <div class="text-center mt-5">

                <h2>Nenhum álbum favoritado</h2>

                <p class="text-secondary">
                    Clique no coração de um álbum para adicioná-lo aqui.
                </p>

                <a href="index.html" class="btn btn-danger mt-3">
                    Explorar Álbuns
                </a>

            </div>
        `;

        return;

    }

    favoritos.forEach(album => {

        const article = document.createElement("article");

        article.className =
            "col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2";

        article.innerHTML = `

            <div class="card mb-4 h-100">

                <img
                    src="${album.imagem}"
                    class="card-img-top"
                    alt="${album.nome}"
                >

                <div class="card-body d-flex flex-column">

                    <h2 class="card-title h5">
                        ${album.nome}
                    </h2>

                    <p class="card-text">
                        ${album.banda}
                    </p>

                    <button
                        class="btn btn-danger mb-2 btn-detalhes"
                        data-id="${album.id}">
                        Ver Detalhes
                    </button>

                    <button
                        class="btn btn-outline-light btn-remover"
                        data-id="${album.id}">
                        Remover dos Favoritos
                    </button>

                </div>

            </div>

        `;

        container.appendChild(article);

    });

    adicionarEventos(albums, usuarioAtual);

}

function adicionarEventos(albums, usuarioAtual) {

    // Ver detalhes
    document.querySelectorAll(".btn-detalhes")
        .forEach(botao => {

            botao.addEventListener("click", () => {

                const album = albums.find(a =>
                    a.id === botao.dataset.id
                );

                localStorage.setItem(
                    "albumSelecionado",
                    JSON.stringify(album)
                );

                window.location.href = "detalhes.html";

            });

        });

    // Remover favorito
    document.querySelectorAll(".btn-remover")
        .forEach(botao => {

            botao.addEventListener("click", async () => {

                usuarioAtual.favoritos =
                    usuarioAtual.favoritos.filter(id =>
                        id !== botao.dataset.id
                    );

                // Atualiza a sessão
                sessionStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(usuarioAtual)
                );

                // Atualiza o JSON Server
                const resposta = await fetch(
                    `http://localhost:3000/usuarios/${usuarioAtual.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            favoritos: usuarioAtual.favoritos
                        })
                    }
                );

                if (!resposta.ok) {

                    alert("Erro ao remover favorito.");
                    return;

                }

                mostrarFavoritos();

            });

        });

}
mostrarFavoritos();