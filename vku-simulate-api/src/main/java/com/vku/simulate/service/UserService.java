package com.vku.simulate.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vku.simulate.entity.User;
import com.vku.simulate.model.UserDTO;
import com.vku.simulate.repository.UserRepository;

import jakarta.transaction.Transactional;

public interface UserService {
	void add(UserDTO userDTO);
	
	void update(UserDTO userDTO);
	
	void delete(Long id);
	
	List<UserDTO> getAll();
	
	UserDTO getOne(Long id);
	
}

@Transactional
@Service
class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	ModelMapper modelMapper;
	
	@Override
	public void add(UserDTO userDTO) {
		User user = modelMapper.map(userDTO, User.class);
		//user.setPassword(new BCryptPasswordEncoder().encode(userDTO.getPassword()));
		userRepository.save(user);
		userDTO.setId(user.getId());
	}
	
	@Override
	public void update(UserDTO userDTO) {
		User user = userRepository.getById(userDTO.getId());
		
		if (user != null) {
			modelMapper.typeMap(UserDTO.class, User.class)
					.map(userDTO, user);
			userRepository.save(user);
		}
	}
	
	@Override
	public void delete(Long id) {
		User user = userRepository.getById(id);
		
		if (user != null) {
			userRepository.delete(user);
		}
	}
	
	@Override
	public List<UserDTO> getAll() {
		List<UserDTO> userDTOs = new ArrayList<>();
		
		userRepository.findAll().forEach((user) -> {
			userDTOs.add(modelMapper.map(user, UserDTO.class));
		});
		
		return userDTOs;
	}
	
	@Override
	public UserDTO getOne(Long id) {
		User user = userRepository.getById(id);
		
		if (user != null) {
			return modelMapper.map(user, UserDTO.class);
		}
		
		return null;
	}
	
}