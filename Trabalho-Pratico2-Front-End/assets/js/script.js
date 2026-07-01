


let albums = [];
async function carregarAlbums() {
    try {
        const resposta = await fetch("http://localhost:3000/albums");
        if (!resposta.ok) {
            throw new Error("Erro ao carregar as informações.")
        }
        albums = await resposta.json();
        iniciarSite();
    }
    catch (erro) {
        console.error(erro);
    }
}

function iniciarSite() {

    criarCards(albums);
    configurarPesquisa();
    criarGrafico()
}

const carouselContainer = document.getElementById("carousel-container");
if (carouselContainer) {
    const banners = [
        {
            imagem: "imgs/Banners/banner.png",
            album: null
        },
        {
            imagem: "imgs/Banners/Banner-BabyMetal2.png",
            album: "BabyMetal"
        },
        {
            imagem: "imgs/Banners/Banner.AV7.png",
            album: "Nightmare"
        },
        {
            imagem: "imgs/Banners/Banner-Metallica.png",
            album: "Master of Puppets"
        }
    ];
    //Criando o carrossel dinâmico 
    banners.forEach((banner, index) => {
        const div = document.createElement("div");
        div.className = index === 0
            ? "carousel-item active" : "carousel-item";

        if (banner.album === null) {
            div.innerHTML = `
                <img
                    src="${banner.imagem}"
                    class="d-block w-100 banner-principal"
                    alt="Banner Principal"
                >
            `;
        }
        else { //Banners com imagens das bandas
            div.innerHTML = ` 
                <img
                    src="${banner.imagem}"
                    class="d-block w-100 banner-album"
                    alt="${banner.album}"
                    data-album="${banner.album}"
                >
            `;
        }
        carouselContainer.appendChild(div);
    });

    const imagensCarousel = document.querySelectorAll(".banner-album"); //Fazendo os banners terem evento de click e levar para a página de detalhes daquele álbum
    imagensCarousel.forEach(imagem => {
        imagem.addEventListener("click", () => {
            const nomeAlbum = imagem.dataset.album;
            const albumEncontrado = albums.find(album => //Procurando o álbum no array
                album.nome === nomeAlbum
            );
            if (albumEncontrado) {
                localStorage.setItem(
                    "albumSelecionado",
                    JSON.stringify(albumEncontrado)
                );
                window.location.href = "detalhes.html";
            }
            else {
                alert("Álbum não encontrado.");
            }
        });
    });
}

//Página detalhes
const imagemAlbum = document.getElementById("album-image");
if (imagemAlbum) {

    const album = JSON.parse( //Pegando a informação do álbum salvo  
        localStorage.getItem("albumSelecionado")
    );

    if (album) { //Se o álbum estiver salvo, as informações são adicionadas nos elementos

        imagemAlbum.src = album.imagem;
        imagemAlbum.alt = album.nome;

        document.getElementById("album-name")
            .textContent = album.nome;

        document.getElementById("album-band")
            .textContent = album.banda;

        document.getElementById("album-year")
            .textContent = album.ano;

        document.getElementById("album-label")
            .textContent = album.gravadora;

        document.getElementById("album-sales")
            .textContent = album.vendas;

        document.getElementById("album-hit")
            .textContent = album.maiorSucesso;


        const listaMusicas =
            document.getElementById("album-musics");
        listaMusicas.innerHTML = "";

        if (album.musicas.length > 10) {
            listaMusicas.classList.add(
                "musicas-duas-colunas"
            );
        }
        else {
            listaMusicas.classList.remove(
                "musicas-duas-colunas"
            );
        }

        album.musicas.forEach(musica => {
            const li =
                document.createElement("li"); //lista de músicas
            li.className = "list-group-item bg-dark text-light border-secondary";
            li.textContent = musica;
            listaMusicas.appendChild(li);
        });
    }
    criarGrafico()
}


function criarCards(listaAlbums) {

    const container = document.getElementById("albums-container");

    if (!container) return;

    container.innerHTML = "";

    listaAlbums.forEach((album, index) => {

        const article = document.createElement("article");

        article.className =
            "col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2";

        article.innerHTML = `
            <div class="card mb-4 h-100 position-relative">

                <img src="${album.imagem}" class="card-img-top" alt="${album.nome}">

                <div class="card-body d-flex flex-column">

                    <h2 class="card-title h5">
                        ${album.nome}
                    </h2>

                    <p class="card-text">
                        ${album.banda}
                    </p>
                    <button
                        class="btn-favorito"
                        data-id="${index}"
                        title="Adicionar aos favoritos">
                        ♡
                    </button>

                    <button
                        class="btn btn-danger mt-auto btn-detalhes"
                        data-id="${albums.indexOf(album)}">
                        Ver Detalhes
                    </button>

                </div>
            </div>
        `;

        

        container.appendChild(article);

        adicionarEventosDetalhes();
    });

    const botoesFavorito = document.querySelectorAll(".btn-favorito");

    botoesFavorito.forEach(botao => {

    const album = albums[botao.dataset.id];

    // Usuário não logado
    if (!usuarioLogado) {

        botao.addEventListener("click", () => {

            alert("Faça login para favoritar álbuns.");

            window.location.href = "login.html";

        });

        return;
    }

    // Marca os favoritos já existentes
    if (
        usuarioLogado.favoritos &&
        usuarioLogado.favoritos.includes(album.id)
    ) {

        botao.classList.add("ativo");
        botao.textContent = "♥";

    }

    botao.addEventListener("click", async () => {

        let favoritos = usuarioLogado.favoritos || [];

        if (favoritos.includes(album.id)) {

            favoritos = favoritos.filter(id => id !== album.id);

            botao.classList.remove("ativo");
            botao.textContent = "♡";

        } else {

            favoritos.push(album.id);

            botao.classList.add("ativo");
            botao.textContent = "♥";

        }

        usuarioLogado.favoritos = favoritos;

        // Atualiza a sessão
        sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioLogado)
        );

        // Atualiza o JSON Server
        await fetch(
            `http://localhost:3000/usuarios/${usuarioLogado.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    favoritos: favoritos
                })
            }
        );

    });

    });
}



function adicionarEventosDetalhes() {

    document.querySelectorAll(".btn-detalhes")
        .forEach(botao => {

            botao.addEventListener("click", () => {

                const albumSelecionado =
                    albums[botao.dataset.id];

                localStorage.setItem(
                    "albumSelecionado",
                    JSON.stringify(albumSelecionado)
                );

                window.location.href = "detalhes.html";

            });

        });

}

function configurarPesquisa() {

    const pesquisa = document.getElementById("pesquisa");

    if (!pesquisa) return;

    pesquisa.addEventListener("input", () => {

        const texto = pesquisa.value.toLowerCase();

        const resultado = albums.filter(album =>

            album.nome.toLowerCase().includes(texto) ||

            album.banda.toLowerCase().includes(texto) ||

            album.genero.toLowerCase().includes(texto)

        );

        criarCards(resultado);

    });

}

function criarGrafico() {
    const canvas = document.getElementById("graficoGeneros");
    if (!canvas)
        return;

    const quantidadeGeneros = {};
    albums.forEach(album => {
        if (!quantidadeGeneros[album.genero]) {
            quantidadeGeneros[album.genero] = 0;
        }
        quantidadeGeneros[album.genero]++
    });

    new Chart(canvas, {
        type: "pie",
        data: {
            labels: Object.keys(quantidadeGeneros),
            datasets: [{
                label: "Álbuns",
                data: Object.values(quantidadeGeneros),
                backgroundColor: [
                    "#7B1FA2",
                    "#C62828",
                    "#1565C0",
                    "#2E7D32",
                    "#EF6C00",
                    "#455A64",
                    "#AD1457",
                    "#6D4C41"
                ],
                borderColor: "#111111",
                borderWidth: 4,

                hoverBorderColor: "#FFFFFF",
                hoverBorderWidth: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: "left",
                    align: "center",
                    labels: {
                        color: "#ffffff",
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 20,
                        boxWidth: 15,
                        boxHeight: 15,
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: "Distribuição dos Gêneros Musicais",
                    color: "#ffffff",
                    font: {
                        size: 20   
                    }
                }
            }
        }
    })
}

carregarAlbums();

