package com.vku.simulate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vku.simulate.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
