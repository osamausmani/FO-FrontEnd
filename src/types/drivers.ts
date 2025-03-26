export interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: string;
  company: string;
  hireDate: string;
  assignedVehicle?: string;
  performance?: {
    safetyScore: number;
    efficiencyScore: number;
    overallRating: number;
    lastReviewDate: string;
  };
  certifications?: {
    type: string;
    issuedDate: string;
    expiryDate: string;
    issuedBy: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
