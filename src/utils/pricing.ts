interface PricingParams {
  distance: number;
  duration: number;
  isShared: boolean;
  vehicleType: string;
  demandMultiplier: number;
}

export function calculatePrice({
  distance,
  duration,
  isShared,
  vehicleType,
  demandMultiplier
}: PricingParams): number {
  const vehiclePrices = {
    'auto': {
      base: 30,
      perKm: 12,
      perMinute: 1,
      minFare: 40
    },
    'mini': {
      base: 40,
      perKm: 15,
      perMinute: 1.5,
      minFare: 60
    },
    'sedan': {
      base: 50,
      perKm: 18,
      perMinute: 2,
      minFare: 80
    },
    'suv': {
      base: 60,
      perKm: 22,
      perMinute: 2.5,
      minFare: 100
    }
  };

  const selectedVehicle = vehiclePrices[vehicleType as keyof typeof vehiclePrices] || vehiclePrices.mini;
  
  let price = selectedVehicle.base;
  price += distance * selectedVehicle.perKm;
  price += duration * selectedVehicle.perMinute;
  price *= demandMultiplier;

  if (isShared) {
    price *= 0.6; // 40% discount for shared rides
  }

  const finalPrice = Math.max(Math.round(price), selectedVehicle.minFare);
  
  return Math.ceil(finalPrice / 10) * 10;
}