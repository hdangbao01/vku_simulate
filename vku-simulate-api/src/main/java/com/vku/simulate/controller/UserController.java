package com.vku.simulate.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vku.simulate.model.UserDTO;
import com.vku.simulate.service.UserService;

@RestController
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/user")
	public UserDTO addUser(@RequestBody UserDTO userDTO) {
		userService.add(userDTO);
		return userDTO;
	}
	
	@GetMapping("/user")
	public List<UserDTO> getAll() {
		return userService.getAll();
	}
	
	@GetMapping("/user/{id}")
	public ResponseEntity<UserDTO> get(@PathVariable(name= "id") Long id) {
		return Optional.of(new ResponseEntity<UserDTO>(userService.getOne(id), HttpStatus.OK))
				.orElse(new ResponseEntity<UserDTO>(HttpStatus.NOT_FOUND));
	}
	
	@PutMapping("/user")
	public void update(@RequestBody UserDTO userDTO) {		
		userService.update(userDTO);
	}
	
	@DeleteMapping("/user/{id}")
	public String delete(@PathVariable(name= "id") Long id) {
		userService.delete(id);
		
		return "Deleted successfully";
	}
	
}
