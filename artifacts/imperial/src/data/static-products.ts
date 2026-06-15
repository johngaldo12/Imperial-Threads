import whiteTee from "@assets/Messenger_creation_5EE8CFDF-0313-4A17-9D8E-F557A17B1213_1781499563294.jpeg";
import blackTee from "@assets/Messenger_creation_0F0AA5B6-27F0-4F66-9436-A921E9B98972_1781499563406.jpeg";
import blackShorts from "@assets/Messenger_creation_E9839DD4-40B3-4A01-B7E1-19F78E52F07E_1781499563428.jpeg";
import navyShorts from "@assets/Messenger_creation_29B0DDF2-5348-41B3-95D5-2327224868CC_1781499563450.jpeg";
import creamShorts from "@assets/Messenger_creation_1A90CA47-053A-41F9-87FC-E71234BA6DAE_1781499563479.jpeg";
import creamShortsPromo from "@assets/Messenger_creation_10182249-7292-4CBE-860B-8D927D4C9D5C_1781499563511.jpeg";

import type { Product } from "@workspace/api-client-react";

export const STATIC_PRODUCTS: Product[] = [
  {
    id: "static-white-tee",
    title: "Imperial Anubis Tee — White",
    handle: "imperial-anubis-tee-white",
    description: "Premium heavyweight cotton tee featuring the Imperial Anubis embroidery patch. Structured silhouette, dropped shoulders, oversized fit. Made to be worn heavily and aged beautifully.",
    productType: "Shirt",
    tags: ["shirt", "tee", "white", "anubis"],
    featuredImage: { url: whiteTee, altText: "Imperial Anubis Tee in White" },
    images: [{ url: whiteTee, altText: "Imperial Anubis Tee in White" }],
    priceRange: {
      minVariantPrice: { amount: "45.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "45.00", currencyCode: "USD" },
    },
    variants: [
      { id: "static-white-tee-s",  title: "S",  price: { amount: "45.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "static-white-tee-m",  title: "M",  price: { amount: "45.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "static-white-tee-l",  title: "L",  price: { amount: "45.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "L" }] },
      { id: "static-white-tee-xl", title: "XL", price: { amount: "45.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "XL" }] },
    ],
  },
  {
    id: "static-black-tee",
    title: "Imperial Anubis Tee — Black",
    handle: "imperial-anubis-tee-black",
    description: "Premium heavyweight cotton tee featuring the Imperial Anubis embroidery patch. Structured silhouette, dropped shoulders, oversized fit. Made to be worn heavily and aged beautifully.",
    productType: "Shirt",
    tags: ["shirt", "tee", "black", "anubis"],
    featuredImage: { url: blackTee, altText: "Imperial Anubis Tee in Black" },
    images: [{ url: blackTee, altText: "Imperial Anubis Tee in Black" }],
    priceRange: {
      minVariantPrice: { amount: "45.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "45.00", currencyCode: "USD" },
    },
    variants: [
      { id: "static-black-tee-s",  title: "S",  price: { amount: "45.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "static-black-tee-m",  title: "M",  price: { amount: "45.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "static-black-tee-l",  title: "L",  price: { amount: "45.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "L" }] },
      { id: "static-black-tee-xl", title: "XL", price: { amount: "45.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "XL" }] },
    ],
  },
  {
    id: "static-black-shorts",
    title: "Imperial Anubis Shorts — Black",
    handle: "imperial-anubis-shorts-black",
    description: "Soft, breathable fabric with premium Anubis embroidery on the left leg. Elastic waistband with drawstring. Minimal look, maximum impact.",
    productType: "Shorts",
    tags: ["shorts", "black", "anubis"],
    featuredImage: { url: blackShorts, altText: "Imperial Anubis Shorts in Black" },
    images: [{ url: blackShorts, altText: "Imperial Anubis Shorts in Black" }],
    priceRange: {
      minVariantPrice: { amount: "55.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "55.00", currencyCode: "USD" },
    },
    variants: [
      { id: "static-black-shorts-s",  title: "S",  price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "static-black-shorts-m",  title: "M",  price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "static-black-shorts-l",  title: "L",  price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "L" }] },
      { id: "static-black-shorts-xl", title: "XL", price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "XL" }] },
    ],
  },
  {
    id: "static-navy-shorts",
    title: "Imperial Anubis Shorts — Navy",
    handle: "imperial-anubis-shorts-navy",
    description: "Soft, breathable fabric with premium Anubis embroidery on the left leg. Elastic waistband with drawstring. Minimal look, maximum impact.",
    productType: "Shorts",
    tags: ["shorts", "navy", "anubis"],
    featuredImage: { url: navyShorts, altText: "Imperial Anubis Shorts in Navy" },
    images: [{ url: navyShorts, altText: "Imperial Anubis Shorts in Navy" }],
    priceRange: {
      minVariantPrice: { amount: "55.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "55.00", currencyCode: "USD" },
    },
    variants: [
      { id: "static-navy-shorts-s",  title: "S",  price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "static-navy-shorts-m",  title: "M",  price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "static-navy-shorts-l",  title: "L",  price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "L" }] },
      { id: "static-navy-shorts-xl", title: "XL", price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "XL" }] },
    ],
  },
  {
    id: "static-cream-shorts",
    title: "Imperial Anubis Shorts — Cream",
    handle: "imperial-anubis-shorts-cream",
    description: "Soft, breathable fabric with premium Anubis embroidery on the left leg. Elastic waistband with drawstring. Ultra-soft fabric — comfort, style, confidence.",
    productType: "Shorts",
    tags: ["shorts", "cream", "white", "anubis"],
    featuredImage: { url: creamShorts, altText: "Imperial Anubis Shorts in Cream" },
    images: [
      { url: creamShorts, altText: "Imperial Anubis Shorts in Cream" },
      { url: creamShortsPromo, altText: "Imperial Premium Shorts — Cream detail" },
    ],
    priceRange: {
      minVariantPrice: { amount: "55.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "55.00", currencyCode: "USD" },
    },
    variants: [
      { id: "static-cream-shorts-s",  title: "S",  price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "static-cream-shorts-m",  title: "M",  price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "static-cream-shorts-l",  title: "L",  price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "L" }] },
      { id: "static-cream-shorts-xl", title: "XL", price: { amount: "55.00", currencyCode: "USD" }, availableForSale: true, selectedOptions: [{ name: "Size", value: "XL" }] },
    ],
  },
];
