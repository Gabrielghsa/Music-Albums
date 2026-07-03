let albumEditandoId = null; 
const usuarioAtual = JSON.parse(
    sessionStorage.getItem("usuarioLogado")
);
// Apenas administradores podem acessar
if (!usuarioAtual || !usuarioAtual.admin) {
    window.location.href = "index.html";
}
const tabelaAlbums = document.getElementById("tabelaAlbums");
async function listarAlbums() {
    console.log("Entrou na função listarAlbums");
    try {
        const resposta = await fetch(
            "http://localhost:3000/albums"
        );
        const albums = await resposta.json();
        tabelaAlbums.innerHTML = "";
        albums.forEach(album => {
            tabelaAlbums.innerHTML += `
                <tr>
                    <td>${album.nome}</td>
                    <td>${album.banda}</td>
                    <td>${album.ano}</td>
                    <td>
                        <button
                            class="btn btn-warning btn-sm btn-editar"
                            data-id="${album.id}">
                            Editar
                        </button>
                        <button
                            class="btn btn-danger btn-sm btn-excluir"
                            data-id="${album.id}">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });
    }
    catch (erro) {
        console.error(erro);
        alert("Erro ao carregar os álbuns.");
    }
}

document.addEventListener("click", async (event) => {
   document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-editar")) {
        const id = event.target.dataset.id;
        const resposta = await fetch(`http://localhost:3000/albums/${id}`);
        const album = await resposta.json();
        albumEditandoId = id;
        preencherFormulario(album);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (event.target.classList.contains("btn-excluir")) {
        const id = event.target.dataset.id;
        const confirmar = confirm(
            "Tem certeza que deseja excluir este álbum?"
        );
        if (!confirmar) return;
        try {
            const resposta = await fetch(
                `http://localhost:3000/albums/${id}`,
                {
                    method: "DELETE"
                }
            );
            if (!resposta.ok) {
                throw new Error("Erro ao excluir álbum");
            }
            alert("Álbum excluído com sucesso!");
            listarAlbums();
        }
        catch (erro) {
            console.error(erro);
            alert("Erro ao excluir álbum.");
        }
    }
});
});
listarAlbums();
const formAlbum = document.getElementById("formAlbum");
formAlbum.addEventListener("submit", async (event) => {
    event.preventDefault();
    const album = {
        nome: document.getElementById("nome").value.trim(),
        banda: document.getElementById("banda").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        ano: Number(document.getElementById("ano").value),
        gravadora: document.getElementById("gravadora").value.trim(),
        vendas: document.getElementById("vendas").value.trim(),
        maiorSucesso: document.getElementById("maiorSucesso").value.trim(),
        imagem: document.getElementById("imagem").value.trim(),
        banner: document.getElementById("banner").value.trim(),
        musicas: document.getElementById("musicas")
            .value
            .split("\n")
            .map(m => m.trim())
            .filter(m => m !== "")
    };
    try {
        // Editando um álbum
        if (albumEditandoId) {
            const resposta = await fetch(
                `http://localhost:3000/albums/${albumEditandoId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(album)
                }
            );
            if (!resposta.ok) {
                throw new Error("Erro ao editar álbum");
            }
            alert("Álbum atualizado com sucesso!");
            albumEditandoId = null;
        }
        // Cadastrando um novo album
        else {
            const resposta = await fetch("http://localhost:3000/albums", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(album)
            });
            if (!resposta.ok) {
                throw new Error("Erro ao cadastrar álbum");
            }
            alert("Álbum cadastrado com sucesso!");
        }
        formAlbum.reset();
        listarAlbums();
    }
    catch (erro) {
        console.error(erro);
        alert("Erro ao salvar álbum");
    }
});
function preencherFormulario(album) {
    document.getElementById("nome").value = album.nome;
    document.getElementById("banda").value = album.banda;
    document.getElementById("genero").value = album.genero;
    document.getElementById("ano").value = album.ano;
    document.getElementById("gravadora").value = album.gravadora;
    document.getElementById("vendas").value = album.vendas;
    document.getElementById("maiorSucesso").value = album.maiorSucesso;
    document.getElementById("imagem").value = album.imagem;
    document.getElementById("banner").value = album.banner || "";
    document.getElementById("musicas").value =
        (album.musicas || []).join("\n");
}