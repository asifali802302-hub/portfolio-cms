package com.portfoliocms.backend.repository;

import com.portfoliocms.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

}