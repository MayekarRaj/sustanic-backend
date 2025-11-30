import { config } from '../config/env';

export class ConfigService {
  getQuantities() {
    return {
      quantities: config.allowedQuantities,
    };
  }
}

