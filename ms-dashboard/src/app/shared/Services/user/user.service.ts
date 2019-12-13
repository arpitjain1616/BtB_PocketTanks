import { Injectable } from '@angular/core';
import { RepositoryService } from '../repository.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private repositoryService: RepositoryService) {}

  getKPIData(): any {
    return this.repositoryService.getData(
      `twitter/kpis`
    );
  }

  getLineChartData(): any {
    return this.repositoryService.getData(
      `twitter/sentiment?type=timeseries`
    );
  }

  getPieChartData(): any {
    return this.repositoryService.getData(
      `twitter/sentiment?type=average`
    );
  }
  
  getHistogramData(): any {
    return this.repositoryService.getData(
      `twitter/profilestats`
    );
  }

  getWordCloudData(): any {
    return this.repositoryService.getData(
      `twitter/wordcloud`
    );
  }
  
  getRecentTweets(): any {
    return this.repositoryService.getData(
      `twitter/posts`
    );
  }
  
  getProfileData(): any {
    return this.repositoryService.getData(
      `twitter/profile`
    );
  }

  getScheduledTweets(): any {
    return this.repositoryService.getData(
      `twitter/scheduledtweets`
    );
  }

  createUser(createUserRequest): any {
    return this.repositoryService.post(
      "registration",
      createUserRequest
    );
  }
  
  loginUser(loginUserRequest): any {
    return this.repositoryService.post(
      "login",
      loginUserRequest
    );
  }

  verifyEmail(emailVerificationRequest): any {
    return this.repositoryService.post(
      "emailverification",
      emailVerificationRequest
    );
  }

  newPost(newPostRequest) :any
  {
    return this.repositoryService.post(
      "/twitter/tweet",
      newPostRequest
    );
  }
}
