package com.hospitalx.emr.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IDAO<T> {
    public T save(T t);

    public Page<T> getAll(String keyword, Pageable pageable);

    public T get(String id);

    public T update(T t);

    public Boolean delete(String id);
}
