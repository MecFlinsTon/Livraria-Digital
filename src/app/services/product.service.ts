import { Injectable, signal, Signal } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsData: Product[] = [
    {
      id: 1,
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      price: 39.9,
      image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      description: 'Um clássico sensível sobre amizade, imaginação e humanidade.',
      available: true
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      price: 34.5,
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e2c6b3e?auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      description: 'Distopia poderosa que pergunta até onde vai o controle do Estado.',
      available: true
    },
    {
      id: 3,
      title: 'A Sombra do Vento',
      author: 'Carlos Ruiz Zafón',
      price: 49.9,
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      description: 'Mistério literário em Barcelona para leitores apaixonados.',
      available: true
    },
    {
      id: 4,
      title: 'O Alquimista',
      author: 'Paulo Coelho',
      price: 29.9,
      image: 'https://images.unsplash.com/photo-1473187983305-f615310e7daa?auto=format&fit=crop&w=400&q=80',
      rating: 4.3,
      description: 'Fábula espiritual sobre encontrar a própria lenda pessoal.',
      available: true
    },
    {
      id: 5,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      price: 64.0,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80&sat=-100',
      rating: 4.7,
      description: 'História da humanidade contada com clareza e profundidade.',
      available: true
    },
    {
      id: 6,
      title: 'O Hobbit',
      author: 'J.R.R. Tolkien',
      price: 54.9,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      description: 'Aventura fantástica que abriu a Terra-média para milhões.',
      available: true
    },
    {
      id: 7,
      title: 'Mindset',
      author: 'Carol S. Dweck',
      price: 45.0,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
      rating: 4.4,
      description: 'Como mudar seu pensamento pode transformar trabalho e vida.',
      available: true
    },
    {
      id: 8,
      title: 'O Poder do Hábito',
      author: 'Charles Duhigg',
      price: 42.5,
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      description: 'Ciência dos hábitos para criar mudanças duradouras.',
      available: true
    },
    {
      id: 9,
      title: 'A Menina que Roubava Livros',
      author: 'Markus Zusak',
      price: 59.9,
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      description: 'Romance emocionante sobre livros, guerra e resistência.',
      available: true
    }
  ];

  products: Signal<Product[]> = signal(this.productsData);

  getAll(): Product[] {
    return this.products();
  }
}
