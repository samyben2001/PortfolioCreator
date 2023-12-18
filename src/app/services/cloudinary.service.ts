import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  http = inject(HttpClient)

  upload(file: any) {
    console.log(file)
    let body: FormData = new FormData()

    body.append("file", file)
    body.append("upload_preset", environment.cloudinaryUploadPreset)
    body.append("public_id", file.name.split('.').slice(0, -1).join('.'))
    body.append("api_key", environment.cloudinaryApiKey)
    
    return this.http.post('https://api.cloudinary.com/v1_1/dkteptxqq/image/upload', body)
  }
}
