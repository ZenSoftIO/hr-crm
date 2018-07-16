package com.erkprog.zensofthrcrm.data.entity;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class VacanciesResponse {
  private Integer count;
  private String next;
  private String previous;
  @SerializedName("results")
  private List<Vacancy> vacancyList;

  public Integer getCount() {
    return count;
  }

  public void setCount(Integer count) {
    this.count = count;
  }

  public String getNext() {
    return next;
  }

  public void setNext(String next) {
    this.next = next;
  }

  public String getPrevious() {
    return previous;
  }

  public void setPrevious(String previous) {
    this.previous = previous;
  }

  public List<Vacancy> getVacancyList() {
    return vacancyList;
  }

  public void setVacancyList(List<Vacancy> vacancyList) {
    this.vacancyList = vacancyList;
  }
}
