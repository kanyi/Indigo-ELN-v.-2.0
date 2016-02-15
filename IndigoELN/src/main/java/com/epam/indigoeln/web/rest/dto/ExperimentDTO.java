package com.epam.indigoeln.web.rest.dto;

import com.epam.indigoeln.core.model.Experiment;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO for Experiment
 */
public class ExperimentDTO extends BasicDTO {

    private static final long serialVersionUID = -305591958439648518L;

    private String templateId;
    private List<ComponentDTO> components = new ArrayList<>();

    public ExperimentDTO() {
    }

    public ExperimentDTO(Experiment experiment) {
        super(experiment);
        this.templateId = experiment.getTemplateId();
        this.components = experiment.getComponents() != null ?
            experiment.getComponents().stream().map(ComponentDTO::new).collect(Collectors.toList()) : new ArrayList<>();
    }

    public String getTemplateId() {
        return templateId;
    }

    public List<ComponentDTO> getComponents() {
        return components;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public void setComponents(List<ComponentDTO> components) {
        this.components = components != null ? components : new ArrayList<>();
    }
}
