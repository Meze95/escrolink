import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, signal, HostListener, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { Verify } from '../verify/verify';
import { Header } from '../../components/shared/header/header';
import { Footer } from '../../components/shared/footer/footer';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, Login, Register, Verify, Header, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
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

  // Testimonials / Reviews (10 dummy reviews)
  reviews = [
    { name: 'Sarah K.', role: 'Seller', text: 'EscroLink made selling so much easier — payments were smooth and protected.', avatar: null },
    { name: 'John M.', role: 'Buyer', text: 'Great service. I felt safe paying through EscroLink and the seller was trustworthy.', avatar: null },
    { name: 'Priya R.', role: 'Seller', text: 'Quick payouts and excellent support when I needed help.', avatar: null },
    { name: 'Daniel L.', role: 'Buyer', text: 'Seamless experience and I received my order exactly as described.', avatar: null },
    { name: 'Aisha B.', role: 'Seller', text: 'Helped reduce disputes — buyers are more confident now.', avatar: null },
    { name: 'Carlos T.', role: 'Buyer', text: 'Fast resolution for a small dispute, support was very helpful.', avatar: null },
    { name: 'Maya S.', role: 'Buyer', text: 'User-friendly and reliable escrow system for online deals.', avatar: null },
    { name: 'Omar F.', role: 'Seller', text: 'Transactions are easier to track, and I’ve seen fewer chargebacks.', avatar: null },
    { name: 'Lina H.', role: 'Buyer', text: 'I recommend EscroLink to my friends who sell online.', avatar: null },
    { name: 'Ethan P.', role: 'Seller', text: 'Professional platform — great for social sellers.', avatar: null }
  ];

  getInitials(name: string) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    const initials = parts.map(p => p[0]).filter(Boolean).slice(0, 2).join('');
    return initials.toUpperCase();
  }

  @ViewChild('testimonialsScroll', { static: false }) testimonialsScroll!: ElementRef<HTMLDivElement>;
  testimonialsInterval: any;
  testimonialsPaused = false;

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

  constructor(private el: ElementRef, private scrollAnimationService: ScrollAnimationService) { }

  ngOnInit() {
    this.startAutoSlide();
    this.scrollAnimationService.initializeAOS();
  }

  ngAfterViewInit() {
    // start auto-scrolling testimonials after view is ready
    this.startTestimonialsAutoScroll();
    this.scrollAnimationService.refreshAOS();
  }

  startTestimonialsAutoScroll() {
    const el = this.testimonialsScroll?.nativeElement;
    if (!el) return;

    if (this.testimonialsInterval) {
      clearInterval(this.testimonialsInterval);
    }

    this.testimonialsInterval = setInterval(() => {
      if (this.testimonialsPaused) return;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 1) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 2, behavior: 'auto' });
      }
    }, 20);
  }

  stopTestimonialsAutoScroll() {
    if (this.testimonialsInterval) {
      clearInterval(this.testimonialsInterval);
      this.testimonialsInterval = null;
    }
  }

  pauseTestimonials() {
    this.testimonialsPaused = true;
  }

  resumeTestimonials() {
    this.testimonialsPaused = false;
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
    this.stopTestimonialsAutoScroll();
  }

  showModal = false;
  modalType: 'login' | 'register' | 'verify' | null = null;

  openModal(type: 'login' | 'register' | 'verify') {
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalType = null;
  }
}