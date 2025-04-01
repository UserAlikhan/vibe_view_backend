import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class AvatarPhotoValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const oneKb = 1024;
        return value.size < oneKb * 1;
    }
}