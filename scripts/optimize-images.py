import os
from PIL import Image

def optimize_images():
    # Caminho absoluto para a pasta de imagens
    script_dir = os.path.dirname(os.path.abspath(__file__))
    img_dir = os.path.join(script_dir, '..', 'assets', 'images')
    
    if not os.path.exists(img_dir):
        print(f"Erro: O diretório {img_dir} não existe.")
        return

    # Extensões válidas para processamento
    valid_extensions = ('.jpg', '.jpeg', '.png')
    
    # Lista todos os arquivos que atendem aos critérios
    images_to_process = [
        f for f in os.listdir(img_dir)
        if f.lower().endswith(valid_extensions)
    ]

    print(f"Encontradas {len(images_to_process)} imagens para processar na pasta assets/images...")

    for filename in images_to_process:
        file_path = os.path.join(img_dir, filename)
        file_baseId, ext = os.path.splitext(filename)
        webp_path = os.path.join(img_dir, f"{file_baseId}.webp")
        
        try:
            # Abre a imagem original
            with Image.open(file_path) as img:
                # 1. Otimiza a imagem original substituindo-a (comprimindo)
                if ext.lower() in ('.jpg', '.jpeg'):
                    # Salva JPEG com qualidade 75 (bom equilíbrio de tamanho/qualidade para Web)
                    img.save(file_path, 'JPEG', quality=75, optimize=True)
                elif ext.lower() == '.png':
                    # Otimiza o PNG sem perda visível mantendo o formato
                    img.save(file_path, 'PNG', optimize=True)
                print(f"✓ Original otimizado: {filename}")
                
                # 2. Gera a versão WebP (se não existir ou para garantir a re-geração)
                # O formato WebP oferece compressão superior (reduz até 30% a mais que o JPEG)
                img.save(webp_path, 'WEBP', quality=80, method=6)
                
                # Obtém e formata o tamanho do novo arquivo WebP gerado
                webp_size_kb = os.path.getsize(webp_path) / 1024
                print(f"  ↳ Conversão WebP concluída: {file_baseId}.webp ({webp_size_kb:.2f} KB)")
                
        except Exception as e:
            print(f"Erro ao processar {filename}: {str(e)}")

if __name__ == '__main__':
    optimize_images()
    print("\nProcessamento finalizado!")
