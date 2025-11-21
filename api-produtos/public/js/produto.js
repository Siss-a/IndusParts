/* Troca de imagem principal pelas miniaturas */
document.querySelectorAll('.thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-image');
        document.getElementById('mainImage').setAttribute('src', src);
        document.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});