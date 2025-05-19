export interface FileInfo {
  path: string;          // Waar het bestand op de server staat, b.v. 'uploads/posters/1234.png'
  originalname: string;  // Naam zoals geüpload: 'feestposter.png'
  size: number;          // Grootte in bytes
  mimetype: string;      // Type bestand, bv. 'image/png'
  uploadedat: Date;      // Upload datum
}
