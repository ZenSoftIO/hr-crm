package com.erkprog.zensofthrcrm.data.entity;

import com.google.gson.annotations.SerializedName;

public class Vacancy {
  private Integer id;
  private String name;
  @SerializedName("created")
  private String dateCreated;
  @SerializedName("last_published")
  private String dateLastPublished;
  private String status;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDateCreated() {
    return dateCreated;
  }

  public void setDateCreated(String dateCreated) {
    this.dateCreated = dateCreated;
  }

  public String getDateLastPublished() {
    return dateLastPublished;
  }

  public void setDateLastPublished(String dateLastPublished) {
    this.dateLastPublished = dateLastPublished;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
