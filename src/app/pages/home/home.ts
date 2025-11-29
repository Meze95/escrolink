import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, HostListener, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  currentSlide = signal(0);
  autoSlideInterval: any;

  slides = [
    {
      title: 'Secure Payments for Social Marketplace Deals',
      desc: 'EscroLink protects buyers and sellers during transactions from Instagram, Facebook, WhatsApp, TikTok & more.',
      image: 'images/hero/slide1_svg.svg'
    },
    {
      title: 'No More "What I Ordered vs What I Got"',
      desc: 'We hold buyer payment until goods arrive and are approved.',
      image: 'images/hero/slide2_svg.svg'
    },
    {
      title: 'Trusted Middleman for Online Commerce',
      desc: 'Prevent scams, build trust, and complete transactions safely.',
      image: 'images/hero/slide3_svg.svg'
    }
  ];

  faqs = [
    {
      question: 'Is EscroLink safe to use?',
      answer: 'Yes. Payments are held securely until the buyer approves the delivered goods. We use industry-standard encryption and security measures to protect all transactions.',
      isOpen: false
    },
    {
      question: 'Who pays the fee?',
      answer: 'Usually sellers pay the transaction fee, but the seller may choose to split or absorb the fee based on their agreement with the buyer.',
      isOpen: false
    },
    {
      question: 'Do you support international payments?',
      answer: 'Yes, depending on your region and transaction type. We support multiple payment methods and currencies to facilitate international transactions.',
      isOpen: false
    },
    {
      question: 'How long does it take to release payment?',
      answer: 'Payment is released immediately after the buyer confirms receipt and approval of the goods. This typically happens within 24-48 hours of delivery.',
      isOpen: false
    },
    {
      question: 'What happens if there is a dispute?',
      answer: 'If there is a dispute, our support team will mediate between buyer and seller. The funds remain in escrow until the dispute is resolved fairly.',
      isOpen: false
    },
    {
      question: 'Can I cancel a transaction?',
      answer: 'Yes, transactions can be cancelled before the seller ships the goods. Once shipped, cancellation requires agreement from both parties.',
      isOpen: false
    }
  ];

  // Custom dropdown for Contact Subject
  subjects = [
    'General Inquiry',
    'Transaction Support',
    'Account Issues',
    'Partnership',
    'Feedback'
  ];
  selectedSubject = this.subjects[0];
  isSubjectOpen = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.startAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide(false);
    }, 6000);
  }

  resetAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.startAutoSlide();
  }

  nextSlide(manual: boolean = true) {
    this.currentSlide.set((this.currentSlide() + 1) % this.slides.length);
    if (manual) this.resetAutoSlide();
  }

  prevSlide(manual: boolean = true) {
    this.currentSlide.set(
      (this.currentSlide() - 1 + this.slides.length) % this.slides.length
    );
    if (manual) this.resetAutoSlide();
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
    this.resetAutoSlide();
  }

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  selectSubject(s: string) {
    this.selectedSubject = s;
    this.isSubjectOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isSubjectOpen = false;
    }
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }
}