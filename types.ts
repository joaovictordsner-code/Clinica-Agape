import React from 'react';

export interface ExpertInfo {
  name: string;
  profession: string;
  city: string;
  address: string;
  whatsappLink: string;
  instagramLink: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}