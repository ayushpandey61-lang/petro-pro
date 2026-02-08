export const getVolumeFromDip = (tank, dipCm) => {
        const lengthM = parseFloat(tank.inside_length_m);
        const diameterM = parseFloat(tank.inside_diameter_m);
        
        if (isNaN(lengthM) || isNaN(diameterM) || lengthM <= 0 || diameterM <= 0) {
            return 0; // Return 0 instead of throwing an error for invalid dimensions
        }

        const dipMm = parseFloat(dipCm) * 10;

        if (isNaN(dipMm) || dipMm < 0) {
            return 0; // Return 0 for invalid dip
        }
        
        const diameterMm = diameterM * 1000;
        const lengthMm = lengthM * 1000;

        // If dip is greater than diameter, cap it at diameter
        const h = Math.min(dipMm, diameterMm);

        const radiusMm = diameterMm / 2;
        const r = radiusMm;

        if (h === 0) return 0;
        
        if (h >= diameterMm) { // Tank is full
            return (Math.PI * r * r * lengthMm) / 1000000;
        }

        const angle = 2 * Math.acos((r - h) / r);
        const sectorArea = (r * r * angle) / 2;
        const triangleArea = (r - h) * Math.sqrt(2 * r * h - h * h);
        const segmentArea = sectorArea - triangleArea;
        
        if(isNaN(segmentArea)){
            return 0;
        }

        const volumeCubicMm = segmentArea * lengthMm;
        const volumeLiters = volumeCubicMm / 1000000;

        return volumeLiters;
    };