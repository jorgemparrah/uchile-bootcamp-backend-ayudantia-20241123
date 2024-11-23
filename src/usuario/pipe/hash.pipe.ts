import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { HashingService } from 'src/seguridad/service/hashing.service';

@Injectable()
export class HashPipe implements PipeTransform {

  constructor(
    private readonly hashingService: HashingService
  ) {
  }

  transform(value: any, metadata: ArgumentMetadata) {
    value.password = this.hashingService.getHash(value.password);
    return value;
  }
}
